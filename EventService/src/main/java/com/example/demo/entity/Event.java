package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Event {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NonNull
	private String titre;
	@NonNull
	private String dateDebut;
	@NonNull
	private String dateFin;
	@NonNull
	private String lieu;
	@Builder
	public Event(Long id, String titre, String dateDebut, String dateFin, String lieu) {
		this.id = id;
		this.titre = titre;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.lieu = lieu;
	}
	
	
}
