package com.klef.proj.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.klef.proj.entity.User;
import com.klef.proj.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        try {

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                token = authHeader.substring(7);

                try {
                    username = jwtUtil.extractUsername(token);
                } catch (Exception e) {
                    System.out.println("JWT extraction failed: " + e.getMessage());
                }
            }

            if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

                if (jwtUtil.validateToken(token)) {

                    User user = userRepository.findByEmail(username);

                    if (user != null) {

                        String roleName =
                                user.getRole() != null
                                ? user.getRole().getName()
                                : "USER";

                        String authority =
                                "ROLE_" + roleName.toUpperCase();

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        Collections.singletonList(
                                                new SimpleGrantedAuthority(authority)
                                        )
                                );

                        authToken.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder.getContext()
                                             .setAuthentication(authToken);

                        System.out.println(
                                "Authenticated User: "
                                + username
                                + " | Authority: "
                                + authority
                        );
                    }
                }
            }

        } catch (Exception e) {
            System.out.println("JWT Filter Error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}