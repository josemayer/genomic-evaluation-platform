CREATE CONSTRAINT uniquePersonId IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT uniqueConditionId IF NOT EXISTS FOR (c:Condition) REQUIRE c.id IS UNIQUE;

CREATE (a: Person {id: 8});
CREATE (a: Person {id: 9});
