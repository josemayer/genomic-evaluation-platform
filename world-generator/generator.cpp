#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <deque>
#include <map>
#include <vector>
#include <set>
#include <cstdlib>
#include <time.h>

#define fs std::filesystem

using std::string;
using argList = std::deque<string>;
using path = std::filesystem::path;

#define WORLD path("./world")

#define DNA_SIZE 1000

#define CONDITION_CHANCE 100
#define MUTATION_CHANCE 500

std::map<string, int(*)(argList)> commandMap;

void assertDirectoryExists(path p) {
	if (!fs::exists(p)) {
		fs::create_directory(p);
	}
}

std::ofstream writeToWorld(string subdir, string file) {
	assertDirectoryExists(WORLD / subdir);
	return std::ofstream(WORLD / subdir / file);
}

std::ifstream readFromWorld(string subdir, string file) {
	return std::ifstream(WORLD / subdir / file);
}

template <typename T>
T getRandomFromSet(std::set<T> s) {
	int ind = rand() % s.size();
	auto it = s.begin();
	while (ind--) {
		it++;
	}
	return *it;
}

std::set<int> getConditionGenes() {
	std::set<int> genes;
	for (auto const& cond_file : fs::directory_iterator(WORLD / "conditions")) {
		std::ifstream file(cond_file.path());
		int geneCount;
		file>>geneCount;
		while (geneCount--) {
			int gene;
			file>>gene;
			genes.insert(gene);
		}
	}
	return genes;
}

int generateNewGene() {
	static auto condGenes = getConditionGenes();

	if (rand() % CONDITION_CHANCE == 0) {
		return getRandomFromSet(condGenes);
	} else {
		int g = 0;
		while (g == 0)
			g = rand();
		return g;
	}
}

int help(argList args) {
	std::cout<<"Usage: <program> <command> <arguments...>"<<std::endl;
	std::cout<<"To learn more about some command use \"help\" as the first command argument"<<std::endl;
	std::cout<<"Available commands:"<<std::endl;
	for (auto it = commandMap.begin(); it != commandMap.end(); it++) {
		std::cout<<"- "<<it->first<<std::endl;
	}
	return 1;
}

int newCondition(argList args) {
	if (args.size() < 1) {
		std::cout<<"Missing condition name"<<std::endl;
		return 1;
	}

	if (args[0] == "help") {
		return 0;
	}

	int x;
	int min = 10;
	std::set<int> genes;
	do {
		x = rand();
		genes.insert(x ^ -1);
	} while (x <= RAND_MAX / ((genes.size() + min - 1) / min));

	std::ofstream file = writeToWorld("conditions", args[0]);

	file << genes.size();
	for (auto gene : genes) {
		file << gene << std::endl;
	}

	return 0;
}

int newPerson(argList args) {
	if (args.size() < 1) {
		std::cout<<"Missing person name";
		return 1;
	}

	if (args[0] == "help") {
		return 0;
	}

	int x;
	std::set<int> genes;
	std::set<int> condGenes = getConditionGenes();

	while (genes.size() < DNA_SIZE) {
		genes.insert(generateNewGene());
	}

	auto f = writeToWorld("people", args[0]);

	for (auto g : genes) {
		f<<g<<std::endl;
	}

	return 0;
}

int newChild(argList args) {
	if (args.size() > 0 && args[0] == "help") {
		return 0;
	}

	if (args.size() < 2) {
		std::cout<<"Missing parrent name";
		return 1;
	}

	std::vector<std::ifstream> files;
	files.push_back(readFromWorld("people", args[0]));
	files.push_back(readFromWorld("people", args[1]));

	std::vector<std::set<int>> parents(2, std::set<int>());

	for (int i = 0; i < 2; i++) {
		for (int j = 0; j < DNA_SIZE; j++) {
			int g;
			files[i] >> g;
			parents[i].insert(g);
		}
	}

	std::set<int> genes;
	while (genes.size() < DNA_SIZE) {
		if (rand() % MUTATION_CHANCE == 0) {
			genes.insert(generateNewGene());
		} else {
			int p = genes.size() % 2;
			genes.insert(getRandomFromSet(parents[p]));
		}
	}

	auto f = writeToWorld("people", args[2]);

	for (auto g : genes) {
		f<<g<<std::endl;
	}

	return 0;
}

int main(int argc, char *argv[]) {
	commandMap = {
		{"new_condition", newCondition},
		{"new_person", newPerson},
		{"new_child", newChild},
		{"help", help},
	};

	if (argc < 2) {
		help({});
		return 1;
	}

	srand(time(NULL));

	argList arguments;
	for (int i = 1; i < argc; i++) {
		arguments.push_back(argv[i]);
	}

	string command = arguments.front();
	arguments.pop_front();

	auto fn = commandMap.find(command);
	if (fn == commandMap.end()) {
		fn = commandMap.find("help");
	}

	if (fn->first != "help" && !fs::exists(WORLD)) {
		fs::create_directory(WORLD);
	}

	return fn->second(arguments);
}

