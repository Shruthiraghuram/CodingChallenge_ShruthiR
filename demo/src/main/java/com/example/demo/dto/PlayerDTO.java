package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PlayerDTO {

    @NotBlank(message = "Player name is required")
    private String playerName;

    @NotNull(message = "Jersey number is required")
    private Integer jerseyNumber;

    @NotBlank(message = "Role is required")
    private String role;

    private Integer totalMatches;

    @NotBlank(message = "Team name is required")
    private String teamName;

    private String countryStateName;
    private String description;

    
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public Integer getJerseyNumber() { return jerseyNumber; }
    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getTotalMatches() { return totalMatches; }
    public void setTotalMatches(Integer totalMatches) { this.totalMatches = totalMatches; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getCountryStateName() { return countryStateName; }
    public void setCountryStateName(String countryStateName) { this.countryStateName = countryStateName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}