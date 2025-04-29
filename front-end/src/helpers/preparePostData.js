const preparePostData = (formData, currentPost = null) => {
  let experienceYear = 0;
  if (formData.experience) {
    const expLower = formData.experience.toLowerCase().trim();

    if (expLower === "không" || expLower === "không yêu cầu" || expLower === "0" ) {
        experienceYear = 0;
    }
    else if (expLower.includes("năm") || expLower.includes("nam")) {
      const yearMatch = formData.experience.match(/(\d+)/);
      experienceYear = yearMatch ? parseInt(yearMatch[0]) : 0;
    }
    else if (!isNaN(expLower)) {
      experienceYear = parseInt(expLower);
    }
  }

  const baseData = {
    name: formData.title,
    experienceYear: experienceYear,
    technologies: Array.isArray(formData.requirements)
      ? formData.requirements.map((tech) => ({
          id: typeof tech === "object" ? tech.id : tech,
          name: typeof tech === "object" ? tech.name : tech,
        }))
      : [],
    context: formData.context || "",
  };

  if (currentPost) {
    return {
      ...baseData,
      id: currentPost.id,
      exprised: currentPost.exprised
    };
  }

  return {
    ...baseData,
    exprised: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
};

export default preparePostData;
