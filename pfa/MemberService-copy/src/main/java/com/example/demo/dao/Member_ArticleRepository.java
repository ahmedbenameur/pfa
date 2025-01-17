package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Member_Article_Id;
import com.example.demo.entity.Member_Article;

public interface Member_ArticleRepository extends JpaRepository<Member_Article, Member_Article_Id> {
	@Query("select m from Member_Article m where m.id.auteur_id=:x")
	List<Member_Article> findByArticleId(@Param("x") Long autId);
}
