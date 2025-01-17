package com.example.demo.service;

import java.util.Date;
import java.util.List;

import com.example.demo.entity.Article;


public interface IArticleService {
	public Article addArticle(Article m);

	public void deleteArticle(Long id);

	public Article updateArticle(Article p);

	public Article findArticle(Long id);

	public List<Article> findAll();

	// Filtrage par Articles
	public List<Article> findByTitre(String titre);

	public List<Article> findByType(String lien);

	public List<Article> findByDate(Date date);
}
