package com.example.demo.controller;

import com.example.demo.entity.EnseignantChercheur;
import com.example.demo.entity.Etudiant;
import com.example.demo.entity.Member;
import com.example.demo.service.IMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class MemberRestController {
	@Autowired
	IMemberService memberService;

	@RequestMapping(value = "/membres", method = RequestMethod.GET)
	public List<Member> findMembres() {
		return memberService.findAll();
	}

	@GetMapping(value = "/membres/{id}")
	public Member findOneMemberById(@PathVariable Long id) {
		return memberService.findMember(id);
	}

	@PostMapping(value = "/membres/enseignant")
	public Member addMembre(@RequestBody EnseignantChercheur m) {
		return memberService.addMember(m);
	}

	@PostMapping(value = "/membres/etudiant")
	public Member addMembre(@RequestBody Etudiant e) {
		return memberService.addMember(e);
	}

	@DeleteMapping(value = "/membres/{id}")
	public void deleteMembre(@PathVariable Long id) {
		memberService.deleteMember(id);
	}

	@PutMapping(value = "/membres/etudiant/{id}")
	public Member updatemembre(@PathVariable Long id, @RequestBody Etudiant p) {
		p.setId(id);
		return memberService.updateMember(p);
	}

	@PutMapping(value = "/membres/enseignant/{id}")
	public Member updateMembre(@PathVariable Long id, @RequestBody EnseignantChercheur p) {
		p.setId(id);
		return memberService.updateMember(p);
	}

	@GetMapping("/fullmember/{id}")
	public Member findAFullMember(@PathVariable(name = "id") Long id) {
		Member mbr = memberService.findMember(id);
		mbr.setPubs(memberService.findArticleParAuteur(id));
		return mbr;
	}
}