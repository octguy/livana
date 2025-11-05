package octguy.livanabe.service;

import octguy.livanabe.entity.Role;
import octguy.livanabe.enums.UserRole;

import java.util.List;

public interface IRoleService {

    List<Role> findAll();

    void createNewRole(UserRole role);
}
