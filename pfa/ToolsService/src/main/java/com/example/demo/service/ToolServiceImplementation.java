package com.example.demo.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.ToolRepository;
import com.example.demo.entity.Tool;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ToolServiceImplementation implements IToolService{
	ToolRepository toolRepository;
	@Override
	public Tool addTool(Tool m) {
		return toolRepository.save(m);
	}

	@Override
	public void deleteTool(Long id) {
		toolRepository.deleteById(id);
	}

	@Override
	public Tool updateTool(Tool p) {
		return toolRepository.saveAndFlush(p);
	}

	@Override
	public Tool findTool(Long id) {
		return (Tool)toolRepository.findById(id).get();
	}

	@Override
	public List<Tool> findAll() {
		return (List<Tool>) toolRepository.findAll();
	}

	@Override
	public List<Tool> findBySource(String source) {
		return (List<Tool>) toolRepository.findBySource(source); 
	}

	@Override
	public List<Tool> findByDate(Date date) {
		return (List<Tool>) toolRepository.findByDate(date);
	}

}
