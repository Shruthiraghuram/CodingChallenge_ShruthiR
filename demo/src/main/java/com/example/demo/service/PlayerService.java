package com.example.demo.service;


import com.example.demo.dto.PlayerDTO;
import com.example.demo.entity.Player;
import com.example.demo.exception.PlayerNotFoundException;
import com.example.demo.repo.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with ID: " + id));
    }

    public Player createPlayer(PlayerDTO dto) {
        Player player = mapToEntity(dto);
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, PlayerDTO dto) {
        Player existing = getPlayerById(id);
        existing.setPlayerName(dto.getPlayerName());
        existing.setJerseyNumber(dto.getJerseyNumber());
        existing.setRole(dto.getRole());
        existing.setTotalMatches(dto.getTotalMatches());
        existing.setTeamName(dto.getTeamName());
        existing.setCountryStateName(dto.getCountryStateName());
        existing.setDescription(dto.getDescription());
        return playerRepository.save(existing);
    }

    public void deletePlayer(Long id) {
        Player existing = getPlayerById(id);
        playerRepository.delete(existing);
    }

    private Player mapToEntity(PlayerDTO dto) {
        Player player = new Player();
        player.setPlayerName(dto.getPlayerName());
        player.setJerseyNumber(dto.getJerseyNumber());
        player.setRole(dto.getRole());
        player.setTotalMatches(dto.getTotalMatches());
        player.setTeamName(dto.getTeamName());
        player.setCountryStateName(dto.getCountryStateName());
        player.setDescription(dto.getDescription());
        return player;
    }
}
