all: generator conditions people

generator: generator.cpp
	g++ -std=c++17 -o $@ $<

conditions: generator
	./generator new_condition chule
	./generator new_condition asma
	./generator new_condition cancer_de_pulmao
	./generator new_condition astigmatismo

people: generator conditions
	./generator new_person jose
	./generator new_person marcos
	./generator new_person joao
	./generator new_person maria
	./generator new_person lurdes
	./generator new_person virginia
	./generator new_child joao maria joana
	./generator new_child jose lurdes joao_luis
	./generator new_child marcos viriginia bernadete
	./generator new_child joao_luis bernadete pedro
	./generator new_child joana vinicius joao_vinicius


clean:
	rm -rf world
	rm -rf generator

.PHONY: clean conditions
