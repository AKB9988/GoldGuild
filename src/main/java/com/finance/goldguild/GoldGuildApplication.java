package com.finance.goldguild;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GoldGuildApplication {

    public static void main(String[] args) {
        SpringApplication.run(GoldGuildApplication.class, args);
    }

}
