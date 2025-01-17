package com.example.demo.entity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

import com.example.demo.bean.ArticleBean;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name= "type_mbr", discriminatorType = DiscriminatorType.STRING,length = 3)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor 
@RequiredArgsConstructor

public abstract class Member implements Serializable{
	 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;
	 @NonNull
	 private String cin;
	 @NonNull
	 private String nom;
	 @NonNull
	 private String prenom;
	 @NonNull @Temporal(TemporalType.DATE)
	 @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	 private Date dateNaissance;
	 private byte[] photo;
	 
	 @NonNull
	 private String cv;
	 @NonNull
	 private String email;
	 @NonNull
	 private String password;
	 @Transient
	 Collection<ArticleBean> pubs;
}
