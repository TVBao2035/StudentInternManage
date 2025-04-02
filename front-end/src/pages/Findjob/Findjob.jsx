import React, { useState } from "react";
import SkillItem from  "../../components/SkillItem"
import SearchBar from "../../components/Searchbar";
import Post from "../../components/Post";

const FindJob = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showAllSkills, setShowAllSkills] = useState(false);
};
