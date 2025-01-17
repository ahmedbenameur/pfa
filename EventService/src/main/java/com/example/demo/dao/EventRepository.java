package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.webmvc.RepositoryRestController;

import com.example.demo.entity.Event;
@RepositoryRestController
public interface EventRepository extends JpaRepository<Event, Long>{
	List<Event> findBytitre (String name);
	List<Event> findBylieu (String lieu);
	List<Event> findByDateDebut (String date);
	List<Event> findByDateFin (String date);	
}
