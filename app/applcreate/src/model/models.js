class Availability {
    constructor(from_date, to_date){
        this.from_date = from_date;
        this.to_date = to_date;
    }
}

class Competency {
    constructor(name){
        this.name = name;
    }
}

class Competence_profile{
    constructor(years_of_experience, competency){
        this.years_of_experience = years_of_experience;
        this.competency = new Competency(competency);
    }
}

class Person {
    constructor(username, name, surname, pnr, email){
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.pnr = pnr;
        this.email = email;
    }
}

class Application{
    constructor(person, availabilities=[], competence_profiles=[]){
        this.person = person;
        this.availabilities = availabilities;
        this.competence_profiles = competence_profiles;
    }

    addAvailability(availability){
        this.Availabilities.push(availability);
    }

    addCompetence_profile(competence_profile){
        this.Competence_profiles.push(competence_profile);
    }
}

module.exports = { Availability, Competency, Competence_profile, Person, Application}