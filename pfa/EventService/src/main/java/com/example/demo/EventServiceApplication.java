package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import com.example.demo.entity.Event;
import com.example.demo.service.IEventService;

import jakarta.websocket.ClientEndpoint;
import lombok.AllArgsConstructor;

@SpringBootApplication
@EnableDiscoveryClient
@AllArgsConstructor
public class EventServiceApplication  implements CommandLineRunner{
	IEventService eventService;
	public static void main(String[] args) {
		SpringApplication.run(EventServiceApplication.class, args);
	}
	@Override
	public void run(String... args) throws Exception {
		Event evt1 = Event.builder().titre("pyfac").lieu("marasim").dateDebut("2024-11-9").dateFin("2024-11-11").build();
		eventService.addEvent(evt1);
		evt1.setLieu("marassim");
		eventService.updateEvent(evt1);
	}

}
