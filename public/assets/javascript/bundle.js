var app = angular.module('fellow_app', []);

// app.controller('fellow_controller', function($scope) {
// 	$scope.fellows = ['James York', 'Alex Suriano', 'Cam Herringshaw', 'Major Sapp'];
// });
var sizes = {
	xs: "1-5",
	s: "6-10",
	m: "11-15",
	l: "16-20",
	xl: "21+"
};

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

// module.exports = {
// 	companies: companies,
// 	fellows: fellows
// };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInN0dWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmZWxsb3dfYXBwJywgW10pO1xuXG5hcHAuY29udHJvbGxlcignZmVsbG93X2NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLmZlbGxvd3MgPSBbJ0phbWVzIFlvcmsnLCAnQWxleCBTdXJpYW5vJywgJ0NhbSBIZXJyaW5nc2hhdycsICdNYWpvciBTYXBwJ107XG59KTsiLCJ2YXIgc2l6ZXMgPSB7XG5cdHhzOiBcIjEtNVwiLFxuXHRzOiBcIjYtMTBcIixcblx0bTogXCIxMS0xNVwiLFxuXHRsOiBcIjE2LTIwXCIsXG5cdHhsOiBcIjIxK1wiXG59O1xuXG52YXIgZmVsbG93cyA9IFt7XG5cdG5hbWU6IFwiTmljayBEZWRlbmJhY2hcIixcblx0YmlvOiBcIkknbSBjb29sLlwiLFxuXHRzY2hvb2w6IFwiVW5pdmVyc2l0eSBvZiBNaWNoaWdhblwiLFxuXHRtYWpvcjogXCJDb21wdXRlciBFbmdpbmVlcmluZ1wiLFxuXHRza2lsbHM6IFtcIkMrK1wiLCBcIkVtYmVkZGVkXCJdLFxuXHRpbnRlcmVzdHM6IFtcIkdlb2NhY2hpbmdcIiwgXCJHYW1pbmdcIiwgXCJNb3ZpZXNcIl0sXG5cdGxpbms6IFwiZ2l0aHViLmNvbS9SeW91emFcIlxufSxcbntcblx0bmFtZTogXCJCcnVjZSBXYXluZVwiLFxuXHRiaW86IFwiRGVhZCBwYXJlbnRzLlwiLFxuXHRzY2hvb2w6IFwiR290aGFtIFVuaXZlcnNpdHlcIixcblx0bWFqb3I6IFwiQWxvb2ZuZXNzXCIsXG5cdHNraWxsczogW1wiQSBsb3RcIl0sXG5cdGludGVyZXN0czogW1wiQmVpbmcgQmF0bWFuXCIsIFwiSnVzdGljZVwiXSxcblx0bGluazogXCJnaXRodWIuY29tL25vdF9iYXRtYW5cIlxufV07XG5cbnZhciBjb21wYW5pZXMgPSBbe1xuXHRuYW1lOiBcIlRvbWVcIixcblx0ZGVzY3JpcHRpb246IFwiSW9UIGZvciBvZmZpY2VcIixcblx0c2l6ZTogc2l6ZXMucyxcblx0ZGVzaXJlZF9za2lsbHM6IFtcIkFuZHJvaWRcIiwgXCJpT1NcIiwgXCJFbWJlZGRlZFwiXSxcblx0bG9jYXRpb246IFwiUm95YWwgT2FrXCIsXG5cdGxpbms6IFwidG9tZXNvZnR3YXJlLmNvbVwiXG59LFxue1xuXHRuYW1lOiBcIldheW5lIEVudGVycHJpc2VzXCIsXG5cdGRlc2NyaXB0aW9uOiBcIlN1c3BpY2lvdXNseSBoaWdoIFImRCBidWRnZXRcIixcblx0c2l6ZTogc2l6ZXMueGwsXG5cdGRlc2lyZWRfc2tpbGxzOiBbXCJDcmltZWZpZ2h0aW5nXCIsIFwiS2VlcGluZyBzZWNyZXRzXCJdLFxuXHRsb2NhdGlvbjogXCJHb3RoYW1cIixcblx0bGluazogXCJ3d3cud2F5bmVlbnQuY29tXCJcbn1dO1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vIFx0Y29tcGFuaWVzOiBjb21wYW5pZXMsXG4vLyBcdGZlbGxvd3M6IGZlbGxvd3Ncbi8vIH07XG5cbi8qXG52YXIgZmVsbG93ID0ge1xuXHRuYW1lOiBcIlwiLFxuXHRiaW86IFwiXCIsXG5cdHNjaG9vbDogXCJcIixcblx0bWFqb3I6IFwiXCIsXG5cdHNraWxsczogW1wiXCJdLFxuXHRpbnRlcmVzdHM6IFtcIlwiXSxcblx0bGluazogXCJcIlxufVxuXG52YXIgY29tcGFueSA9IHtcblx0bmFtZTogXCJcIixcblx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdHNpemU6IHNpemVzLixcblx0ZGVzaXJlZF9za2lsbHM6IFtcIlwiXSxcblx0bG9jYXRpb246IFwiXCIsXG5cdGxpbms6IFwiXCJcbn1cbiovIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9