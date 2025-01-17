package com.example.demo.service;

import java.util.Date;
import java.util.List;

import com.example.demo.entity.Tool;


public interface IToolService {
	public Tool addTool(Tool m);

	public void deleteTool(Long id);

	public Tool updateTool(Tool p);

	public Tool findTool(Long id);

	public List<Tool> findAll();

	// Filtrage par Tools
	public List<Tool> findBySource(String source);

	public List<Tool> findByDate(Date date);

}
