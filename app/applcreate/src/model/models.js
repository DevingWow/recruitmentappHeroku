class AvailabilityDTO {
    constructor(from_date, to_date){
        this.from_date = from_date;
        this.to_date = to_date;
    }
}

class CompetencyDTO {
    constructor(name){
        this.name = name;
    }
}

class Competence_profileDTO{
    constructor(years_of_experience, competency){
        this.years_of_experience = years_of_experience;
        this.competency = new CompetencyDTO(competency);
    }
}

class PersonDTO {
    constructor(name, surname, pnr, email){
        this.name = name;
        this.surname = surname;
        this.pnr = pnr;
        this.email = email;
    }
}

class ApplicationDTO{
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

module.exports = {AvailabilityDTO, CompetencyDTO, Competence_profileDTO, PersonDTO, ApplicationDTO};