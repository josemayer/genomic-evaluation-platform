generator: generator.cpp
	g++ -o $@ $<

conditions: generator
	./generator new_condition chule
	sleep 1
	./generator new_condition asma
	sleep 1
	./generator new_condition cancer_de_pulmao
	sleep 1
	./generator new_condition astigmatismo

people: generator
	./generator new_person jose
	sleep 1
	./generator new_person marcos
	sleep 1
	./generator new_person joao
	sleep 1
	./generator new_person maria
	sleep 1
	./generator new_person lurdes
	sleep 1
	./generator new_person virginia


clean:
	rm -rf world

.PHONY: clean conditions
