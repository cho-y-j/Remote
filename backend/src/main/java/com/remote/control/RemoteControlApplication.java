package com.remote.control;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RemoteControlApplication {

    public static void main(String[] args) {
        SpringApplication.run(RemoteControlApplication.class, args);
    }
}
