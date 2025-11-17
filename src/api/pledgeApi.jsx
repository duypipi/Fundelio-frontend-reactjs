import { httpService } from "@/api/http";

export const pledgeApi = {
    getPledgeMyCampaign: async (campaignId) => {
        return httpService.get(`/campaigns/${campaignId}/pledges`, {
            requireToken: true,
        });
    },

    getTopBackersOfCampaign: async (campaignId) => {
        return httpService.get(`/campaigns/${campaignId}/backers`, {
            requireToken: true,
        });
    },

    getMyPledges: async () => {
        return httpService.get('/users/me/pledges', {
            requireToken: true,
        });
    }

}