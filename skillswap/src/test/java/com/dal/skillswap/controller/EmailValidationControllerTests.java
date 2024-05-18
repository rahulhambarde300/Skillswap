package com.dal.skillswap.controller;
import com.dal.skillswap.models.response.ErrorResponse;
import com.dal.skillswap.service.AuthService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.view.RedirectView;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailValidationControllerTests {

    @Mock
    private AuthService authService;

    @InjectMocks
    @Resource
    private AuthController authController;

    @Test
    public void testEmailValidationSuccess() {
        // Arrange
        String code = "validCode";
        when(authService.verifyByEmail(code)).thenReturn(true);

        // Act
        Object result = authController.email_validation(code);

        // Assert
        assertEquals(RedirectView.class, result.getClass());
        RedirectView redirectView = (RedirectView) result;
        verify(authService).verifyByEmail(code);
    }

    @Test
    public void testEmailValidationFailure() {
        // Arrange
        String code = "invalidCode";
        when(authService.verifyByEmail(code)).thenReturn(false);

        // Act
        Object result = authController.email_validation(code);

        // Assert
        assertEquals(ResponseEntity.class, result.getClass());
        ResponseEntity<?> responseEntity = (ResponseEntity<?>) result;
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        verify(authService).verifyByEmail(code);
    }
}
