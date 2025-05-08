import { Controller, Get } from "@nestjs/common";
import { PrioritiesService } from "./priorities.service";

@Controller("priorities")
export class PrioritiesController {
	constructor(private readonly prioritiesService: PrioritiesService) {}

	@Get()
	findAll() {
		return this.prioritiesService.findAll();
	}
}
