

class AvailabilityDTO {
    constructor(availability_id, person_id, from_date, to_date){
        this.availability_id = availability_id;
        this.person_id = person_id;
        this.from_date = from_date;
        this.to_date = to_date;
    }
}

class PersonDTO {
    constructor (id, name, surname, pnr, email){
        this.person_id = id;
        this.name = name;
        this.surname = surname;
        this.pnr = pnr;
        this.email = email;
    }
}

class ProfileDTO {
    constructor (competence_profile_id, person_id, competence_id, years_of_experience){
        this.competence_profile_id = competence_profile_id;
        this.person_id = person_id;
        this.competence_id = competence_id;
        this.years_of_experience = years_of_experience;
    }
}

class competenceDTO {
    constructor (id, name){
        this.id = id;
        this.name = name;
    }
}


class ApplicationDTO {
    constructor (person_id, name, surname, pnr, email, availabilies, competence_profiles){
        this.person_id = person_id;
        this.name = name;
        this.surname = surname;
        this.pnr = pnr;
        this.email = email;
        this.availabilities = availabilies;
        this.competence_profiles = competence_profiles;
    }
}


module.exports = { ApplicationDTO, AvailabilityDTO, PersonDTO, ProfileDTO, competenceDTO };


