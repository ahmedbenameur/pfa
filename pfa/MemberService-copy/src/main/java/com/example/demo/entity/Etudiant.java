package com.example.demo.entity;

import java.util.Date;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("etd")
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant extends Member {
	private Date dateInscription;
	private String diplome;
	@ManyToOne
	private EnseignantChercheur encadrant;

	@Builder
	public Etudiant(String cin, String nom, String prenom, Date dateNaissance, String cv, String email, String password,
			Date dateInscription, String diplome, EnseignantChercheur encadrant) {
		super(cin, nom, prenom, dateNaissance, cv, email, password);
		this.dateInscription = dateInscription;
		this.diplome = diplome;
		this.encadrant = encadrant;
	}

}
