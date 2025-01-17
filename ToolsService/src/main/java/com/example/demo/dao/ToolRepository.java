package com.example.demo.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.webmvc.RepositoryRestController;

import com.example.demo.entity.Tool;

@RepositoryRestController
public interface ToolRepository extends JpaRepository<Tool, Long>{
	List<Tool> findByDate (Date date);
	List<Tool> findBySource (String source);

}
