package com.hyper_aigent.hyper_aigent_be.services.impl.user;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.LoginResponseDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.UserDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import com.hyper_aigent.hyper_aigent_be.exceptions.UserAlreadyExistsException;
import com.hyper_aigent.hyper_aigent_be.mappers.Mapper;
import com.hyper_aigent.hyper_aigent_be.repositories.UserRepository;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.jwt.JwtService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.user.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final Mapper<UserEntity, UserDto> userMapper;
    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           Mapper<UserEntity, UserDto> userMapper,
                           JwtService jwtService,
                           AuthenticationManager authenticationManager,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtService = jwtService;

        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponseDto signup(UserDto userDto) throws UserAlreadyExistsException {
        // Check if user already exists
        Optional<UserEntity> foundUser = userRepository.findByEmail(userDto.getEmail());
        if (foundUser.isPresent()) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        UserEntity userEntity = userMapper.mapFrom(userDto);
        UserEntity savedUserEntity = userRepository.save(userEntity);
        UserDto savedUserDto = userMapper.mapTo(savedUserEntity);
        savedUserDto.setPassword(null);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(savedUserEntity);

        return LoginResponseDto.builder()
                .token(jwtToken)
                .expiresIn(jwtService.getExpirationTime())
                .user(savedUserDto)
                .build();
    }

    @Override
    public LoginResponseDto login(UserDto userDto) {
        UserEntity userEntity = userMapper.mapFrom(userDto);
        Optional<UserEntity> authenticatedUser = authenticate(userEntity);

        if (authenticatedUser.isPresent()) {
            UserDto authenticatedUserDto = userMapper.mapTo(authenticatedUser.get());
            authenticatedUserDto.setPassword(null);

            String jwtToken = jwtService.generateToken(authenticatedUser.get());

            return LoginResponseDto.builder()
                    .token(jwtToken)
                    .expiresIn(jwtService.getExpirationTime())
                    .user(authenticatedUserDto)
                    .build();
        } else {
            throw new RuntimeException("User not found with email: " + userDto.getEmail());
        }
    }

    @Override
    public boolean isExist(Long id) {
        Optional<UserEntity> optionalExistingUserEntity = userRepository.findById(id);
        if (optionalExistingUserEntity.isPresent() && optionalExistingUserEntity.get().getDeletedAt() == null) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Optional<UserEntity> findById(Long id) {
        Optional<UserEntity> optionalExistingUserEntity = userRepository.findById(id);
        if (optionalExistingUserEntity.isPresent() && optionalExistingUserEntity.get().getDeletedAt() == null) {
            return optionalExistingUserEntity;
        }
        return Optional.empty();
    }

    @Override
    public Optional<UserEntity> findByEmail(String email) {
        Optional<UserEntity> optionalExistingUserEntity = userRepository.findByEmail(email);
        if (optionalExistingUserEntity.isPresent() && optionalExistingUserEntity.get().getDeletedAt() == null) {
            return optionalExistingUserEntity;
        }
        return Optional.empty();
    }

    public Optional<UserEntity> authenticate(UserEntity user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        user.getPassword()
                )
        ); // automatically compare password

        Optional<UserEntity> optionalExistingUserEntity = userRepository.findByEmail(user.getEmail());
        if (optionalExistingUserEntity.isPresent() && optionalExistingUserEntity.get().getDeletedAt() == null) {
            return optionalExistingUserEntity;
        } else {
            return Optional.empty();
        }
    }

    @Override
    public UserEntity partialUpdate(Long id, UserEntity userEntity) {
        userEntity.setId(id);

        Optional<UserEntity> optionalExistingUserEntity = userRepository.findById(id);
        if (optionalExistingUserEntity.isPresent() && optionalExistingUserEntity.get().getDeletedAt() == null) {
            UserEntity existingUserEntity = optionalExistingUserEntity.get();

            if (userEntity.getName() != null) {
                existingUserEntity.setName(userEntity.getName());
            }

            if (userEntity.getEmail() != null) {
                existingUserEntity.setEmail(userEntity.getEmail());
            }

            if (userEntity.getPassword() != null) {
                existingUserEntity.setPassword(userEntity.getPassword());
            }

            return userRepository.save(existingUserEntity);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    @Override
    public void delete(Long id) {
        Optional<UserEntity> optionalUserEntity = userRepository.findById(id);

        if (optionalUserEntity.isPresent()) {
            UserEntity existingUserEntity = optionalUserEntity.get();

            existingUserEntity.setDeletedAt(LocalDateTime.now());
            userRepository.save(existingUserEntity);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}