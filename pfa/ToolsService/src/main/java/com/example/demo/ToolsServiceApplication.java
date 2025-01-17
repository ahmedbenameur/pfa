package com.example.demo;

import java.util.Date;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import com.example.demo.entity.Tool;
import com.example.demo.service.IToolService;

import lombok.AllArgsConstructor;
@AllArgsConstructor
@EnableDiscoveryClient
@SpringBootApplication
public class ToolsServiceApplication implements CommandLineRunner{
	IToolService toolService;
	public static void main(String[] args) {
		SpringApplication.run(ToolsServiceApplication.class, args);
	}
	@Override
	public void run(String... args) throws Exception {
		Tool tool1 = Tool.builder().date(new Date()).source("tool Source").build();
		toolService.addTool(tool1);
		List<Tool> tools = toolService.findBySource("tool Source");
		for (Tool tool : tools) {
			System.out.println(tool.getSource());
		}
		
	}

}
