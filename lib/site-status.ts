// lib/site-status.ts

export type StatusType = 'available' | 'unavailable' | 'under-construction' | 'in-work'

// ✅ OWNER: Change this one line to update status across the entire site
export const SITE_STATUS: StatusType = 'in-work'

export const statusConfig: Record<
    StatusType,
    {
        label: string
        dotColor: string
        textColor: string
        pingColor: string
        tooltip: string
        // Availability card
        availabilityTitle: string
        availabilitySubtitle: string
        // Hire button behavior
        hireBlocked: boolean
        hireBlockedTitle: string
        hireBlockedMessage: string
        hireBlockedWarning: string
    }
> = {
    available: {
        label: 'Available',
        dotColor: 'bg-green-400',
        pingColor: 'bg-green-400',
        textColor: 'text-green-400',
        tooltip: 'Open to new opportunities',
        availabilityTitle: 'Open to internships & collaborations',
        availabilitySubtitle: 'ML Projects · Open Source',
        hireBlocked: false,
        hireBlockedTitle: '',
        hireBlockedMessage: '',
        hireBlockedWarning: '',
    },
    unavailable: {
        label: 'Unavailable',
        dotColor: 'bg-red-400',
        pingColor: 'bg-red-400',
        textColor: 'text-red-400',
        tooltip: 'Not taking on work right now',
        availabilityTitle: 'Currently not available',
        availabilitySubtitle: 'Check back later',
        hireBlocked: true,
        hireBlockedTitle: 'Not Available Right Now',
        hireBlockedMessage:
            'I am currently not open to new opportunities or collaborations. Please check back at a later time.',
        hireBlockedWarning:
            'Reaching out during this period may not receive a response.',
    },
    'under-construction': {
        label: 'Under Construction',
        dotColor: 'bg-yellow-400',
        pingColor: 'bg-yellow-400',
        textColor: 'text-yellow-400',
        tooltip: 'Site is being updated',
        availabilityTitle: 'Site under construction',
        availabilitySubtitle: 'Things are being updated',
        hireBlocked: true,
        hireBlockedTitle: 'Site Under Construction',
        hireBlockedMessage:
            'This portfolio is currently being updated and rebuilt. Some things may not be fully ready yet.',
        hireBlockedWarning:
            'Hire requests sent during this period may be delayed or missed.',
    },
    'in-work': {
        label: 'In Work',
        dotColor: 'bg-blue-400',
        pingColor: 'bg-blue-400',
        textColor: 'text-blue-400',
        tooltip: 'Currently occupied with a project',
        availabilityTitle: 'Occupied with a current project',
        availabilitySubtitle: 'Limited availability · Open Source only',
        hireBlocked: false,
        hireBlockedTitle: '',
        hireBlockedMessage: '',
        hireBlockedWarning: '',
    },
}