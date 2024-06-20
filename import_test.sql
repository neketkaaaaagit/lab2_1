CREATE SCHEMA lab2;
Use lab2;




CREATE TABLE IF NOT EXISTS galactic (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    notes VARCHAR(100)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS sector (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    coordinates VARCHAR(100),
    light_intensity VARCHAR(100),
    foreign_objects VARCHAR(100),
    number_of_starry_sky_objects INT,
    number_undefined_objects INT,
    number_of_specified_objects VARCHAR(100),
    notes VARCHAR(100),
    galactic_id INT NOT NULL,
    CONSTRAINT galactic_fk FOREIGN KEY (galactic_id)
        REFERENCES galactic(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS objects (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    object VARCHAR(100),
    type VARCHAR(100),
    accuracy_of_determination VARCHAR(100),
    quantity INT,
    time VARCHAR(100),
    date DATE,
    note VARCHAR(100),
    galactic_id INT NOT NULL,
    CONSTRAINT galactic_fk_objects FOREIGN KEY (galactic_id)
        REFERENCES galactic(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS natural_objects (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100),
    galaxy VARCHAR(100),
    accuracy INT,
    luminous_flux VARCHAR(100),
    related_objects VARCHAR(100),
    note VARCHAR(100),
    galactic_id INT NOT NULL,
    CONSTRAINT galactic_fk_natural_objects FOREIGN KEY (galactic_id)
        REFERENCES galactic(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS position (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    earth_position VARCHAR(100),
    sun_position VARCHAR(100),
    moon_position VARCHAR(100),
    galactic_id INT NOT NULL,
    CONSTRAINT galactic_fk_position FOREIGN KEY (galactic_id)
        REFERENCES galactic(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) ENGINE=InnoDB;


DELIMITER $$


CREATE PROCEDURE usp_get_data(
    IN in_table1 VARCHAR(50),
    IN in_table2 VARCHAR(50)
)
BEGIN
    IF (in_table1 = 'galactic' AND in_table2 <> 'galactic') THEN
        SET @query = CONCAT('SELECT * FROM ', in_table1, ' t1 JOIN ', in_table2, ' t2 ON t1.id = t2.galactic_id');
    ELSE
        IF (in_table2 = 'galactic' AND in_table1 <> 'galactic') THEN
            SET @query = CONCAT('SELECT * FROM ', in_table1, ' t1 JOIN ', in_table2, ' t2 ON t1.galactic_id = t2.id');
        ELSE
            SET @query = CONCAT('SELECT * FROM ', in_table1, ' t1 JOIN ', in_table2, ' t2 ON t1.galactic_id = t2.galactic_id');
        END IF;
    END IF;

    PREPARE statement FROM @query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE JoinProc(IN table1 VARCHAR(255), IN table2 VARCHAR(255))
BEGIN

  SET @query = CONCAT('SELECT * FROM ', table1, ' t1 JOIN ', table2, ' t2 ON t1.id = t2.id');
  PREPARE stmt FROM @query;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END //

DELIMITER ;


