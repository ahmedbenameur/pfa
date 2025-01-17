package com.example.demo.controller;

import com.example.demo.entity.Article;
import com.example.demo.service.IArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@CrossOrigin("http://localhost:4200")
public class ArticleController {
    @Autowired
    IArticleService articleService;

    @GetMapping
    public List<Article> findArticles() {
        return articleService.findAll();
    }

    @GetMapping(value = "/{id}")
    public Article findOneArticleById(@PathVariable Long id) {
        return articleService.findArticle(id);
    }

    @PostMapping()
    public Article addArticle(@RequestBody Article a) {
        return articleService.addArticle(a);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @PutMapping(value = "/{id}")
    public Article updateArticle(@PathVariable Long id, @RequestBody Article a) {
        a.setId(id);
        return articleService.updateArticle(a);
    }
}