package com.dal.skillswap.controller;

import com.dal.skillswap.enums.UserRole;
import com.dal.skillswap.mapper.SkillMapperImpl;
import com.dal.skillswap.mapper.UserMapperImpl;
import com.dal.skillswap.models.response.User;
import com.dal.skillswap.service.UserService;
import com.dal.skillswap.service.impl.FileStoreServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;

import static com.dal.skillswap.utils.TestUtils.asJsonString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {UserController.class, FileStoreServiceImpl.class,
        SkillMapperImpl.class, UserMapperImpl.class})
@WebMvcTest(excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles({"test"})
class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testHelloWorld() throws Exception {
        MvcResult result = mockMvc.perform(get("/user/test"))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        assertTrue(content.equals("Hello World"));
    }

    @Test
    void testGetSkills() throws Exception {
        MvcResult result = mockMvc.perform(get("/user/getSkills"))
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    @Test
    void testGetUserSkills() throws Exception {
        MvcResult result = mockMvc.perform(get("/user/getUserSkills"))
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    @Test
    void testAddSkills() throws Exception {
        List<String> skills = new ArrayList<>();
        skills.add("test_skill1");
        skills.add("test_skill2");

        MvcResult result = mockMvc.perform(post("/user/addSkills")
                        .content(asJsonString(skills))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    @Test
    void testAddUserSkills() throws Exception {
        List<String> skills = new ArrayList<>();
        skills.add("testSkill1");
        skills.add("testSkills2");

        MvcResult result = mockMvc.perform(post("/user/addUserSkills")
                        .content(asJsonString(skills))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    @Test
    void testGetCoordinates() throws Exception {
        MvcResult result = mockMvc.perform(get("/user/getCoordinates"))
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    @Test
    @WithMockUser
    void testGetNearbyUsers() throws Exception {
        MvcResult result = mockMvc.perform(get("/user/getUsersByLocationAndSkillId")
                        .param("range", "25")
                        .param("skillId", "2"))
                .andExpect(status().isOk())
                .andReturn();

        assertNotNull(result);
    }

    private User getSampleUserEntity() {
        return new User(1L, "test", "test", "test@test.com", "1234567890",
                UserRole.USER, "", true, "testFile", 24, "", "",
                "", "", null, null, null, 0.0, 0.0);
    }
}
