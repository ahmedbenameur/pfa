package com.example.demo.entity;

import java.util.Collection;
import java.util.Date;

import com.example.demo.bean.ArticleBean;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("ens")
@NoArgsConstructor
@AllArgsConstructor

public class EnseignantChercheur extends Member {
	private String grade;
	private String etablissement;

	@Builder
	public EnseignantChercheur(String cin, String nom, String prenom, Date dateNaissance, String cv, String email,
			String password, String grade, String etablissement) {
		super(cin, nom, prenom, dateNaissance, cv, email, password);
		this.grade = grade;
		this.etablissement = etablissement;
	}

}
