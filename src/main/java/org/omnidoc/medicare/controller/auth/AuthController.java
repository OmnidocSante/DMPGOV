package org.omnidoc.medicare.controller.auth;

import org.omnidoc.medicare.entity.users.User;
import org.omnidoc.medicare.response.AuthenticationResponse;
import org.omnidoc.medicare.service.auth.AuthenticationService;
import org.omnidoc.medicare.service.users.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    public AuthController(AuthenticationService authenticationService, UserService userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody User user){
        return authenticationService.login(user);
    }
    @PatchMapping("/create-password")
    public ResponseEntity<Void> createPassword(@RequestParam("token") String token, @RequestBody HashMap<String, String> requestBody) throws Exception {
        String password = requestBody.get("password");
        userService.createPassword(token, password);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @PatchMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestParam("token") String token, @RequestBody HashMap<String, String> requestBody) throws Exception {
        String password = requestBody.get("password");
        userService.resetPassword(token, password);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @PostMapping("/request-password-reset")
    public ResponseEntity<Void> sendResetToken(@RequestBody HashMap<String, String> requestBody) {
        String email = requestBody.get("email");
        userService.sendResetCode(email);
        return ResponseEntity.status(HttpStatus.OK).build();
    }









}
