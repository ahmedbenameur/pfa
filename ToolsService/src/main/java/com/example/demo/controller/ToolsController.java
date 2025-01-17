package com.example.demo.controller;

import com.example.demo.entity.Tool;
import com.example.demo.service.IToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tools")
@CrossOrigin("http://localhost:4200")
public class ToolsController {

    @Autowired
    IToolService toolService;

    @GetMapping
    public List<Tool> findTools() {
        return toolService.findAll();
    }

    @GetMapping(value = "/{id}")
    public Tool findOneToolById(@PathVariable Long id) {
        return toolService.findTool(id);
    }

    @PostMapping
    public Tool addTool(@RequestBody Tool t) {
        return toolService.addTool(t);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteTool(@PathVariable Long id) {
        toolService.deleteTool(id);
    }

    @PutMapping(value = "/{id}")
    public Tool updateTool(@PathVariable Long id, @RequestBody Tool t) {
        t.setId(id);
        return toolService.updateTool(t);
    }
}