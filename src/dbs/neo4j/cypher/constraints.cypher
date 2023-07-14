CREATE CONSTRAINT uniquePersonId IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT uniqueConditionId IF NOT EXISTS FOR (c:Condition) REQUIRE c.id IS UNIQUE;


CREATE (a: Person {id: 1});
CREATE (a: Person {id: 2});
CREATE (a: Person {id: 5});
CREATE (a: Person {id: 6});
CREATE (a: Person {id: 8});
CREATE (a: Person {id: 9});
