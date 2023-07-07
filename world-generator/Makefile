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

clean:
	rm -rf world

.PHONY: clean conditions
