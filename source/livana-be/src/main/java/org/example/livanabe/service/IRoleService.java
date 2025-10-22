package org.example.livanabe.service;

import org.example.livanabe.enums.UserRole;
import org.example.livanabe.model.Role;

import java.util.List;

public interface IRoleService {

    List<Role> findAll();

    void createNewRole(UserRole role);
}
