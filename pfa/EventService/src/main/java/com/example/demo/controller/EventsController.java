package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.demo.entity.Event;
import com.example.demo.service.IEventService;

public class EventsController {
	@Autowired
	IEventService EventService;

	@RequestMapping(value = "/events", method = RequestMethod.GET)
	public List<Event> findevents() {
		return EventService.findAll();
	}

	@GetMapping(value = "/events/{id}")
	public Event findOneEventById(@PathVariable Long id) {
		return EventService.findEvent(id);
	}

	@PostMapping(value = "/events")
	public Event addMembre(@RequestBody Event m) {
		return EventService.addEvent(m);
	}



	@DeleteMapping(value = "/events/{id}")
	public void deleteMembre(@PathVariable Long id) {
		EventService.deleteEvent(id);
	}

	@PutMapping(value = "/events/{id}")
	public Event updatemembre(@PathVariable Long id, @RequestBody Event p) {
		p.setId(id);
		return EventService.updateEvent(p);
	}


}
