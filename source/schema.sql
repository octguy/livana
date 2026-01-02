create table if not exists role
(
    id         uuid        not null
        constraint pk_role
            primary key,
    created_at timestamp   not null,
    updated_at timestamp,
    deleted_at timestamp,
    name       varchar(50) not null
        constraint uc_role_name
            unique
);

create table if not exists "user"
(
    id            uuid         not null
        constraint pk_user
            primary key,
    created_at    timestamp    not null,
    updated_at    timestamp,
    deleted_at    timestamp,
    username      varchar(50)  not null
        constraint uc_user_username
            unique,
    email         varchar(50)  not null
        constraint uc_user_email
            unique,
    enabled       boolean      not null,
    status        varchar(255) not null,
    last_login_at timestamp
);

create table if not exists auth_credential
(
    id                      uuid         not null
        constraint pk_auth_credential
            primary key,
    created_at              timestamp    not null,
    updated_at              timestamp,
    deleted_at              timestamp,
    user_id                 uuid         not null
        constraint uc_auth_credential_user
            unique
        constraint fk_auth_credential_on_user
            references "user",
    password                varchar(200) not null,
    verfication_code        varchar(6),
    verification_expiration timestamp,
    last_password_change_at timestamp
);

create table if not exists password_reset_token
(
    id         uuid         not null
        constraint pk_password_reset_token
            primary key,
    created_at timestamp    not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid         not null
        constraint uc_password_reset_token_user
            unique
        constraint fk_password_reset_token_on_user
            references "user",
    token      varchar(200) not null,
    expiration timestamp    not null
);

create table if not exists refresh_token
(
    id         uuid         not null
        constraint pk_refresh_token
            primary key,
    created_at timestamp    not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid         not null
        constraint uc_refresh_token_user
            unique
        constraint fk_refresh_token_on_user
            references "user",
    token      varchar(200) not null,
    expiration timestamp    not null
);

create table if not exists role_user
(
    created_at timestamp not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid      not null
        constraint fk_role_user_on_user
            references "user",
    role_id    uuid      not null
        constraint fk_role_user_on_role
            references role,
    constraint pk_role_user
        primary key (user_id, role_id)
);

create table if not exists user_profile
(
    id               uuid         not null
        constraint user_profile_pkey
            primary key,
    created_at       timestamp(6) not null,
    deleted_at       timestamp(6),
    updated_at       timestamp(6),
    avatar_url       varchar(200),
    bio              varchar(500),
    display_name     varchar(100) not null,
    phone_number     varchar(15),
    user_id          uuid         not null
        constraint ukebc21hy5j7scdvcjt0jy6xxrv
            unique
        constraint fkqcd5nmg7d7ement27tt9sf3bi
            references "user",
    avatar_public_id varchar(200)
);

create table if not exists interest
(
    id         uuid         not null
        constraint interest_pkey
            primary key,
    created_at timestamp(6) not null,
    deleted_at timestamp(6),
    updated_at timestamp(6),
    key        varchar(50)  not null
        constraint ukn7kc137cygco70pfeqxar2u8v
            unique,
    name       varchar(100) not null,
    icon       text         not null
);

create table if not exists user_interest
(
    interest_id uuid         not null
        constraint fkb2c20k2dqknrm5t337typ3s1b
            references interest,
    user_id     uuid         not null
        constraint fkjavxua3565xa4gtonnf9nai51
            references "user",
    created_at  timestamp(6) not null,
    deleted_at  timestamp(6),
    updated_at  timestamp(6),
    constraint user_interest_pkey
        primary key (interest_id, user_id)
);

create table if not exists amenity
(
    id         uuid         not null
        constraint amenity_pkey
            primary key,
    created_at timestamp(6) not null,
    deleted_at timestamp(6),
    updated_at timestamp(6),
    name       varchar(100) not null,
    icon       varchar(255)
);

create table if not exists base_listing
(
    id           uuid             not null
        constraint base_listing_pkey
            primary key,
    created_at   timestamp(6)     not null,
    deleted_at   timestamp(6),
    updated_at   timestamp(6),
    address      varchar(300)     not null,
    base_price   numeric(10, 2)   not null,
    description  varchar(1000)    not null,
    is_available boolean          not null,
    title        varchar(200)     not null,
    host_id      uuid             not null
        constraint fkoywb7ohpefk6iyvdblchusj3p
            references "user",
    capacity     integer          not null,
    latitude     double precision not null,
    longitude    double precision not null
);

create table if not exists facility
(
    id         uuid         not null
        constraint facility_pkey
            primary key,
    created_at timestamp(6) not null,
    deleted_at timestamp(6),
    updated_at timestamp(6),
    name       varchar(100) not null,
    icon       varchar(255)
);

create table if not exists listing_image
(
    id              uuid         not null
        constraint listing_image_pkey
            primary key,
    created_at      timestamp(6) not null,
    deleted_at      timestamp(6),
    updated_at      timestamp(6),
    image_order     integer      not null,
    image_public_id varchar(255) not null,
    image_url       varchar(255) not null,
    is_thumbnail    boolean      not null,
    listing_id      uuid
        constraint fkp3dfmgxl9akh4aap7514lyk0o
            references base_listing
);

create table if not exists experience_category
(
    id         uuid         not null
        constraint experience_category_pkey
            primary key,
    name       varchar(255) not null
        constraint ukqoe8rueh6pyp8565rhfv5v4rj
            unique,
    created_at timestamp(6) not null,
    deleted_at timestamp(6),
    updated_at timestamp(6),
    icon       varchar(255) not null
);

create table if not exists experience_listing
(
    id                     uuid not null
        constraint experience_listing_pkey
            primary key
        constraint fkihhv2yqb8xagfj6761uoxhvtn
            references base_listing,
    experience_category_id uuid not null
        constraint fkluos94is4xgmycfxrai4hek7q
            references experience_category
);

create table if not exists property_type
(
    id         uuid         not null
        constraint property_type_pkey
            primary key,
    created_at timestamp(6) not null,
    deleted_at timestamp(6),
    updated_at timestamp(6),
    name       varchar(255) not null
        constraint ukn80byogfnbptypes5r6qu5gfv
            unique,
    icon       varchar(255)
);

create table if not exists home_listing
(
    id               uuid not null
        constraint home_listing_pkey
            primary key
        constraint fkqki3nejkx69wsg32yu6vsynrj
            references base_listing,
    property_type_id uuid not null
        constraint fk9ky9gwosg20dk2uviw1qvs5la
            references property_type
);

create table if not exists home_amenity
(
    id          uuid         not null
        constraint home_amenity_pkey
            primary key,
    created_at  timestamp(6) not null,
    deleted_at  timestamp(6),
    updated_at  timestamp(6),
    description varchar(255),
    amenity_id  uuid
        constraint fkhiqohighp2a834i5ffmytw7tb
            references amenity,
    listing_id  uuid
        constraint fkdxrigje0bhwqoo3u2ixhq7s2v
            references home_listing
);

create table if not exists home_facility
(
    id          uuid         not null
        constraint home_facility_pkey
            primary key,
    created_at  timestamp(6) not null,
    deleted_at  timestamp(6),
    updated_at  timestamp(6),
    quantity    integer      not null,
    facility_id uuid
        constraint fkj97ri34dld46opm5qv33r4ljk
            references facility,
    listing_id  uuid
        constraint fkp73pael1r8je2jyju4uq5m3pj
            references home_listing
);

create table if not exists experience_session
(
    id                    uuid         not null
        constraint experience_session_pkey
            primary key,
    created_at            timestamp(6) not null,
    deleted_at            timestamp(6),
    updated_at            timestamp(6),
    booked_participants   integer      not null,
    end_time              timestamp(6) not null,
    session_status        varchar(255) not null
        constraint experience_session_session_status_check
            check ((session_status)::text = ANY
                   ((ARRAY ['ACTIVE'::character varying, 'FULL'::character varying, 'CANCELLED'::character varying])::text[])),
    start_time            timestamp(6) not null,
    experience_listing_id uuid         not null
        constraint fkrlg5psr24wbaxv0gwf4q964y5
            references experience_listing
);

create table if not exists booking
(
    id          uuid           not null
        constraint booking_pkey
            primary key,
    created_at  timestamp(6)   not null,
    deleted_at  timestamp(6),
    updated_at  timestamp(6),
    is_paid     boolean,
    status      varchar(255)   not null
        constraint booking_status_check
            check ((status)::text = ANY
                   ((ARRAY ['PENDING'::character varying, 'CONFIRMED'::character varying, 'CANCELLED'::character varying])::text[])),
    total_price numeric(10, 2) not null,
    host_id     uuid           not null
        constraint fk58jtaj5a3t78sfdgk2xrykrw2
            references "user"
);

create table if not exists experience_booking
(
    quantity   integer,
    id         uuid not null
        constraint experience_booking_pkey
            primary key
        constraint fksr46luki8vrrg8iravd9navkk
            references booking,
    session_id uuid not null
        constraint fk1ge9yqkvwgmuxxc4vwex2xilk
            references experience_session
);

create table if not exists home_booking
(
    check_in_time   timestamp(6) not null,
    check_out_time  timestamp(6) not null,
    guests          integer      not null,
    id              uuid         not null
        constraint home_booking_pkey
            primary key
        constraint fk42tuscy85ujx4aqj5jky57l72
            references booking,
    home_listing_id uuid         not null
        constraint fk6onbfbqmq3ua0nqoax3573y1g
            references home_listing
);

create table if not exists notification
(
    id           uuid         not null
        constraint notification_pkey
            primary key,
    created_at   timestamp(6) not null,
    deleted_at   timestamp(6),
    updated_at   timestamp(6),
    is_read      boolean      not null,
    message      varchar(500) not null,
    reference_id uuid,
    title        varchar(200) not null,
    type         varchar(255) not null
        constraint notification_type_check
            check ((type)::text = ANY
                   ((ARRAY ['BOOKING_HOME'::character varying, 'BOOKING_EXPERIENCE'::character varying, 'BOOKING_CONFIRMED'::character varying, 'BOOKING_CANCELLED'::character varying, 'NEW_REVIEW'::character varying, 'SYSTEM'::character varying])::text[])),
    recipient_id uuid         not null
        constraint fksv355x4lp3kcj16rp7u4eju20
            references "user"
);

create table if not exists review
(
    id          uuid         not null
        constraint review_pkey
            primary key,
    created_at  timestamp(6) not null,
    deleted_at  timestamp(6),
    updated_at  timestamp(6),
    comment     varchar(1000),
    rating      integer      not null,
    review_type varchar(255) not null
        constraint review_review_type_check
            check ((review_type)::text = ANY
                   ((ARRAY ['HOME_LISTING'::character varying, 'EXPERIENCE_LISTING'::character varying])::text[])),
    listing_id  uuid         not null
        constraint fkt0bd0rccni002t5kvdu30qfyx
            references base_listing,
    reviewer_id uuid         not null
        constraint fk8l40hgqc1woa2m6xjap0r30jp
            references "user"
);

create table if not exists conversation
(
    id                   uuid         not null
        constraint conversation_pkey
            primary key,
    created_at           timestamp(6) not null,
    deleted_at           timestamp(6),
    updated_at           timestamp(6),
    last_message_at      timestamp(6),
    last_message_content varchar(500),
    user1_id             uuid         not null
        constraint fkt6t55a0iyshthcrs8nsihl9b
            references "user",
    user2_id             uuid         not null
        constraint fker70n6hu07nnqn6yjwli2nf12
            references "user",
    constraint ukm2andsys8eyyyt9yodkg44hxf
        unique (user1_id, user2_id)
);

create table if not exists message
(
    id              uuid         not null
        constraint message_pkey
            primary key,
    created_at      timestamp(6) not null,
    deleted_at      timestamp(6),
    updated_at      timestamp(6),
    content         varchar(2000),
    file_name       varchar(255),
    file_size       bigint,
    file_type       varchar(100),
    file_url        varchar(500),
    is_read         boolean      not null,
    message_type    varchar(255) not null
        constraint message_message_type_check
            check ((message_type)::text = ANY
                   ((ARRAY ['TEXT'::character varying, 'IMAGE'::character varying, 'FILE'::character varying])::text[])),
    conversation_id uuid         not null
        constraint fk6yskk3hxw5sklwgi25y6d5u1l
            references conversation,
    sender_id       uuid         not null
        constraint fk49xxdqy6p6kxedwvpjyuvnkf
            references "user"
);


