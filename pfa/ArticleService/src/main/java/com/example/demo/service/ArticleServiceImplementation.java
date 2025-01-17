package com.example.demo.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.ArticleRepository;
import com.example.demo.entity.Article;

import lombok.AllArgsConstructor;
@Service
@AllArgsConstructor

public class ArticleServiceImplementation implements IArticleService{
	ArticleRepository articleRepository;
	@Override
	public Article addArticle(Article m) {
		articleRepository.save(m);
		return m;
	}

	@Override
	public void deleteArticle(Long id) {
		articleRepository.deleteById(id);
	}

	@Override
	public Article updateArticle(Article p) {
		return articleRepository.saveAndFlush(p);
	}

	@Override
	public Article findArticle(Long id) {
		return (Article)articleRepository.findById(id).get();
	}

	@Override
	public List<Article> findAll() {
		return (List<Article>)articleRepository.findAll();
	}

	@Override
	public List<Article> findByTitre(String titre) {
		return (List<Article>)articleRepository.findByTitre(titre);
	}
	@Override
	public List<Article> findByType(String type) {
		return (List<Article>)articleRepository.findByLien(type);
	}
	@Override
	public List<Article> findByDate(Date date) {
		return (List<Article>)articleRepository.findByDate(date);
	}

}
