package com.example.demo.service;

import java.util.List;

import com.example.demo.bean.ArticleBean;
import com.example.demo.entity.EnseignantChercheur;
import com.example.demo.entity.Etudiant;
import com.example.demo.entity.Member;

public interface IMemberService {
	// Crud sur les membres
	public Member addMember(Member m);

	public void deleteMember(Long id);

	public Member updateMember(Member p);

	public Member findMember(Long id);

	public List<Member> findAll();

	// Filtrage par propriété
	public Member findByCin(String cin);

	public Member findByEmail(String email);

	public List<Member> findByNom(String nom);

	// recherche spécifique des étudiants
	public List<Etudiant> findByDiplome(String diplome);

	// recherche spécifique des enseignants
	public List<EnseignantChercheur> findByGrade(String grade);

	public List<EnseignantChercheur> findByEtablissement(String etablissement);

	public void affectEtudiantToEnseignant (Long idEtud , Long idENS) ;

	public void affecterAuteurToArticle(Long idauteur, Long idpub);
	public List<ArticleBean> findArticleParAuteur (Long idauteur);
	
}