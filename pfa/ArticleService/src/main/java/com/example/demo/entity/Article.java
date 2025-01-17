package com.example.demo.entity;

import java.util.Date;

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

public class Article {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NonNull
	private String type;
	@NonNull
	private  String titre;
	@NonNull
	private String lien ;
	@NonNull
	private Date date;
	
	private String sourcepdf ;
	@Builder
	public Article(Long id, String type, String titre, String lien,Date date,String sourcepdf) {
		this.id = id;
		this.type = type;
		this.titre = titre;
		this.lien = lien;
		this.date = date;
		this.sourcepdf = sourcepdf;
	}
	
	
}
