import { useState } from "react";
import { useNavigate } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

interface SessionForm {
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

export default function ExperienceSessionsPage() {
  const navigate = useNavigate();
  const { sessions, setSessions } = useExperienceListingStore();

  const [sessionForms, setSessionForms] = useState<SessionForm[]>(
    sessions.length > 0
      ? sessions.map((s) => {
          const start = new Date(s.startTime);
          const end = new Date(s.endTime);
          return {
            date: start,
            startTime: start.toTimeString().slice(0, 5),
            endTime: end.toTimeString().slice(0, 5),
          };
        })
      : [{ date: undefined, startTime: "", endTime: "" }]
  );

  const [errors, setErrors] = useState<string[]>([]);

  const addSession = () => {
    setSessionForms([
      ...sessionForms,
      { date: undefined, startTime: "", endTime: "" },
    ]);
  };

  const removeSession = (index: number) => {
    setSessionForms(sessionForms.filter((_, i) => i !== index));
  };

  const updateSession = (
    index: number,
    field: keyof SessionForm,
    value: string
  ) => {
    const updated = [...sessionForms];
    if (field === "date") {
      // This shouldn't be called for date anymore, but keep for safety
      return;
    }
    updated[index][field] = value;
    setSessionForms(updated);
  };

  const validateSessions = (): boolean => {
    const newErrors: string[] = [];

    // Check all fields filled
    sessionForms.forEach((form, index) => {
      if (!form.date || !form.startTime || !form.endTime) {
        newErrors.push(`Session ${index + 1}: All fields are required`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Convert to Date objects for validation
    const sessionsWithDates = sessionForms.map((form, index) => {
      const dateStr = format(form.date!, "yyyy-MM-dd");
      const startTime = new Date(`${dateStr}T${form.startTime}`);
      const endTime = new Date(`${dateStr}T${form.endTime}`);

      // Check if dates are valid
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        newErrors.push(`Session ${index + 1}: Invalid date or time`);
        return null;
      }

      // Check if start is before end
      if (startTime >= endTime) {
        newErrors.push(
          `Session ${index + 1}: End time must be after start time`
        );
        return null;
      }

      // Check if start is in the future
      if (startTime < new Date()) {
        newErrors.push(
          `Session ${index + 1}: Start time must be in the future`
        );
        return null;
      }

      // Check duration (30 min to 12 hours)
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      if (durationMinutes < 30) {
        newErrors.push(
          `Session ${index + 1}: Duration must be at least 30 minutes`
        );
        return null;
      }
      if (durationMinutes > 720) {
        newErrors.push(`Session ${index + 1}: Duration cannot exceed 12 hours`);
        return null;
      }

      return { index, startTime, endTime };
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Check for overlaps
    for (let i = 0; i < sessionsWithDates.length; i++) {
      for (let j = i + 1; j < sessionsWithDates.length; j++) {
        const s1 = sessionsWithDates[i];
        const s2 = sessionsWithDates[j];
        if (
          s1 &&
          s2 &&
          s1.startTime < s2.endTime &&
          s2.startTime < s1.endTime
        ) {
          newErrors.push(
            `Sessions ${s1.index + 1} and ${s2.index + 1} overlap`
          );
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors([]);
    return true;
  };

  const handleNext = () => {
    if (!validateSessions()) return;

    // Convert to LocalDateTime format (without timezone conversion)
    const convertedSessions = sessionForms.map((form) => {
      const dateStr = format(form.date!, "yyyy-MM-dd");
      return {
        startTime: `${dateStr}T${form.startTime}:00`,
        endTime: `${dateStr}T${form.endTime}:00`,
      };
    });

    setSessions(convertedSessions);
    console.log("Sessions saved:", convertedSessions);
    navigate("/host/experiences/review");
  };

  const getDurationText = (form: SessionForm): string => {
    if (!form.date || !form.startTime || !form.endTime) return "";
    const dateStr = format(form.date, "yyyy-MM-dd");
    const start = new Date(`${dateStr}T${form.startTime}`);
    const end = new Date(`${dateStr}T${form.endTime}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="secondary" className="mb-4">
            Step 7 of 8
          </Badge>
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            Create Available Sessions
          </h1>
          <p className="text-gray-600 text-lg">
            Add time slots when guests can book your experience
          </p>
        </div>

        {/* Sessions List */}
        <div className="space-y-6 mb-8">
          {sessionForms.map((form, index) => {
            const duration = getDurationText(form);
            const isComplete = form.date && form.startTime && form.endTime;

            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-md transition-shadow border-gray-200"
              >
                <CardHeader className="bg-white border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900">
                        Session {index + 1}
                      </span>
                      {isComplete && (
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {duration && (
                        <Badge variant="outline" className="text-gray-700">
                          {duration}
                        </Badge>
                      )}
                      {sessionForms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSession(index)}
                          className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 justify-start text-left font-normal border-gray-300 hover:border-pink-500"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {form.date ? (
                              format(form.date, "PPP")
                            ) : (
                              <span className="text-muted-foreground">
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={form.date}
                            onSelect={(date) => {
                              const updated = [...sessionForms];
                              updated[index].date = date;
                              setSessionForms(updated);
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-600" />
                        Start Time
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={form.startTime.split(":")[0] || ""}
                          onValueChange={(hour) => {
                            const minute = form.startTime.split(":")[1] || "00";
                            updateSession(
                              index,
                              "startTime",
                              `${hour}:${minute}`
                            );
                          }}
                        >
                          <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <span className="flex items-center text-lg font-semibold">
                          :
                        </span>
                        <Select
                          value={form.startTime.split(":")[1] || ""}
                          onValueChange={(minute) => {
                            const hour = form.startTime.split(":")[0] || "00";
                            updateSession(
                              index,
                              "startTime",
                              `${hour}:${minute}`
                            );
                          }}
                        >
                          <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {["00", "15", "30", "45"].map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-600" />
                        End Time
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={form.endTime.split(":")[0] || ""}
                          onValueChange={(hour) => {
                            const minute = form.endTime.split(":")[1] || "00";
                            updateSession(
                              index,
                              "endTime",
                              `${hour}:${minute}`
                            );
                          }}
                        >
                          <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <span className="flex items-center text-lg font-semibold">
                          :
                        </span>
                        <Select
                          value={form.endTime.split(":")[1] || ""}
                          onValueChange={(minute) => {
                            const hour = form.endTime.split(":")[0] || "00";
                            updateSession(
                              index,
                              "endTime",
                              `${hour}:${minute}`
                            );
                          }}
                        >
                          <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {["00", "15", "30", "45"].map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Session Button */}
        <Button
          variant="outline"
          onClick={addSession}
          className="w-full h-14 border-2 border-dashed hover:bg-gray-100 transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Session
        </Button>

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800 mb-3">
                    Please fix the following errors:
                  </p>
                  <ul className="space-y-2">
                    {errors.map((error, i) => (
                      <li
                        key={i}
                        className="text-red-700 text-sm flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Session Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Each session must be between 30 minutes and 12 hours</li>
              <li>• Sessions cannot overlap with each other</li>
              <li>• Start time must be in the future</li>
              <li>• You can add more sessions later</li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/host/experience-listings/price")}
            className="px-8"
          >
            Back
          </Button>
          <Button size="lg" onClick={handleNext} className="px-8">
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
}
