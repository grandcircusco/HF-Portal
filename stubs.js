var sizes = {
	xs: "1-5",
	s: "6-10",
	m: "11-15",
	l: "16-20",
	xl: "21+"
}

var fellows = [{
	name: "Nick Dedenbach",
	bio: "I'm cool.",
	school: "University of Michigan",
	major: "Computer Engineering",
	skills: ["C++", "Embedded"],
	interests: ["Geocaching", "Gaming", "Movies"],
	link: "github.com/Ryouza"
},
{
	name: "Bruce Wayne",
	bio: "Dead parents.",
	school: "Gotham University",
	major: "Aloofness",
	skills: ["A lot"],
	interests: ["Being Batman", "Justice"],
	link: "github.com/not_batman"
}];

var companies = [{
	name: "Tome",
	description: "IoT for office",
	size: sizes.s,
	desired_skills: ["Android", "iOS", "Embedded"],
	location: "Royal Oak",
	link: "tomesoftware.com"
},
{
	name: "Wayne Enterprises",
	description: "Suspiciously high R&D budget",
	size: sizes.xl,
	desired_skills: ["Crimefighting", "Keeping secrets"],
	location: "Gotham",
	link: "www.wayneent.com"
}];

module.exports = {
	companies: companies,
	fellows: fellows
}

/*
var fellow = {
	name: "",
	bio: "",
	school: "",
	major: "",
	skills: [""],
	interests: [""],
	link: ""
}

var company = {
	name: "",
	description: "",
	size: sizes.,
	desired_skills: [""],
	location: "",
	link: ""
}
*/