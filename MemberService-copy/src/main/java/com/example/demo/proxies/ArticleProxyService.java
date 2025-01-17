package com.example.demo.proxies;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.bean.ArticleBean;

@FeignClient(name = "ARTICLESERVICE")
public interface ArticleProxyService {
	@GetMapping("/articles/{id}")
	public ArticleBean findArticleById(@PathVariable(name = "id") Long id);
}
