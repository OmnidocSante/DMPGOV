package org.omnidoc.medicare.config;


import jakarta.annotation.PostConstruct;

import org.omnidoc.medicare.repository.UserRepo;
import org.omnidoc.medicare.utils.AESUtil;
import org.omnidoc.medicare.utils.HmacUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {


    @Bean
    public UserDetailsService userDetailsService(UserRepo userRepo) {
        return username -> userRepo.findByEmail(username).orElseThrow();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserRepo userRepo) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(userDetailsService(userRepo));
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }


    @Value("${SECRET_KEY}")
    private String secretKey;

    @PostConstruct
    public void init() {
        AESUtil.setSecretKey(secretKey);
        HmacUtil.setSecretKey(secretKey);
    }


}
