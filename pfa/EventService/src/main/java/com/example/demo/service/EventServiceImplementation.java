package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.EventRepository;
import com.example.demo.entity.Event;

import lombok.AllArgsConstructor;
@Service
@AllArgsConstructor
public class EventServiceImplementation implements IEventService {
	EventRepository eventRepository;

	@Override
	public Event addEvent(Event m) {
		eventRepository.save(m);
		return m;
	}

	@Override
	public void deleteEvent(Long id) {
		eventRepository.deleteById(id);
	}

	@Override
	public Event updateEvent(Event p) {

		return eventRepository.saveAndFlush(p);
	}

	@Override
	public Event findEvent(Long id) {
		Event e = (Event) eventRepository.findById(id).get();
		return e;
	}

	@Override
	public List<Event> findAll() {
		return eventRepository.findAll();
	}

	@Override
	public Event findBytitre(String titre) {
		return (Event) eventRepository.findBytitre(titre);
	}

	@Override
	public Event findByLieu(String lieu) {
		return (Event) eventRepository.findBylieu(lieu);
	}

	@Override
	public List<Event> findByDateDebut(String dateDebut) {
		return (List<Event>) eventRepository.findByDateDebut(dateDebut);
	}

	@Override
	public List<Event> findByDateFin(String dateFin) {
		return (List<Event>) eventRepository.findByDateDebut(dateFin);

	}

}
