package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Member findByCin(String cin);

	List<Member> findByNomStartingWith(String caractere);

	Member findByEmail(String email);

}