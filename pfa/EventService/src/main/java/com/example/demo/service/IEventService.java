package com.example.demo.service;

import java.util.List;


import com.example.demo.entity.Event;

public interface IEventService {
	// Crud sur les events
	public Event addEvent(Event m);

	public void deleteEvent(Long id);

	public Event updateEvent(Event p);

	public Event findEvent(Long id);

	public List<Event> findAll();

	// Filtrage par events
	public Event findBytitre(String titre);

	public Event findByLieu(String lieu);

	public List<Event> findByDateDebut(String dateDebut);
	public List<Event> findByDateFin(String dateFin);
	


}
