package octguy.livanabe.service.implementation;

import octguy.livanabe.entity.Role;
import octguy.livanabe.enums.UserRole;
import octguy.livanabe.repository.RoleRepository;
import octguy.livanabe.service.IRoleService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RoleServiceImpl implements IRoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public void createNewRole(UserRole role) {
        Role newRole = new Role();
        newRole.setId(UUID.randomUUID());
        newRole.setName(role);
        newRole.setCreatedAt(LocalDateTime.now());
        newRole.setUpdatedAt(LocalDateTime.now());
        roleRepository.save(newRole);
    }
}
